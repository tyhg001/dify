from datetime import UTC, datetime
from typing import Any

from flask import request
from flask_login import current_user  # type: ignore
from flask_restful import Resource, inputs, marshal_with, reqparse  # type: ignore
from sqlalchemy import and_
from werkzeug.exceptions import BadRequest, Forbidden, NotFound

from controllers.console import api
from controllers.console.wraps import account_initialization_required, cloud_edition_billing_resource_check
from extensions.ext_database import db
from fields.installed_app_fields import installed_app_list_fields
from libs.login import login_required
from models import App, InstalledApp
from models.model import ExtUserApps


# 用户自己使用过的app列表
class UserAppsListApi(Resource):
    @login_required
    @account_initialization_required
    @marshal_with(installed_app_list_fields)
    def get(self):
        current_user_id = current_user.id
        query = db.session.query(
            InstalledApp.id,
            ExtUserApps.id.label("ext_user_apps_id"),
            ExtUserApps.is_pinned,
            ExtUserApps.installed_app_id,
            InstalledApp.app_id,
            InstalledApp.app_owner_tenant_id,
            InstalledApp.last_used_at
        ).outerjoin(
            InstalledApp,
            ExtUserApps.installed_app_id == InstalledApp.id
        ).filter(
            ExtUserApps.user_id == current_user_id,
            ExtUserApps.is_deleted.is_(False)  # 处理布尔值比较
        )
        results = query.all()

        installed_app_list: list[dict[str, Any]] = [
            {
                "id": row.id,
                "ext_user_apps_id":row.ext_user_apps_id,
                "app": db.session.query(App).filter(App.id == row.app_id).first(),
                "app_owner_tenant_id": row.app_owner_tenant_id,
                "is_pinned": row.is_pinned,
                "last_used_at": row.last_used_at,
                "editable": True,
                "uninstallable": True,
            }
            for row in results
            if row.app_id is not None
        ]
        installed_app_list.sort(
            key=lambda app: (
                -app["is_pinned"],
                app["last_used_at"] is None,
                -app["last_used_at"].timestamp() if app["last_used_at"] is not None else 0,
            )
        )

        return {"installed_apps": installed_app_list}

class UserAppApi(Resource):
    """
    update and delete an installed app
    use InstalledAppResource to apply default decorators and get installed_app
    """

    @login_required
    def delete(self, user_apps_id):
        user_apps_id=str(user_apps_id)
        user_apps=db.session.query(ExtUserApps).filter(and_(ExtUserApps.id==user_apps_id,ExtUserApps.is_deleted==False)).first()
        if not user_apps:
            raise NotFound("没找到该智能体!")
        user_apps.is_deleted = True
        db.session.commit()

        return {"result": "success", "message": "删除成功！"}

    def patch(self, user_apps_id):
        parser = reqparse.RequestParser()
        parser.add_argument("is_pinned", type=inputs.boolean)
        args = parser.parse_args()
        user_apps_id = str(user_apps_id)

        user_apps = db.session.query(ExtUserApps).filter(
            and_(ExtUserApps.id == user_apps_id, ExtUserApps.is_deleted == False)).first()
        if not user_apps:
            raise NotFound("没找到已发布的智能体")
        commit_args = False
        if "is_pinned" in args:
            user_apps.is_pinned = args["is_pinned"]
            commit_args = True

        if commit_args:
            db.session.commit()

        return {"result": "success", "message": "App info updated successfully"}

class AppIdToInstallID(Resource):
    @login_required
    def get(self, app_id):
        app_id = str(app_id)
        current_tenant_id = current_user.current_tenant_id

        if app_id:
            installed_app = (
                db.session.query(InstalledApp)
                .filter(and_(InstalledApp.tenant_id == current_tenant_id, InstalledApp.app_id == app_id))
                .first()
            )
        else:
            installed_app = db.session.query(InstalledApp).filter(InstalledApp.tenant_id == current_tenant_id).first()

        if installed_app is None:
            raise NotFound("没找到已发布的智能体")
        user_apps = db.session.query(ExtUserApps).filter(and_(ExtUserApps.user_id == current_user.id,ExtUserApps.installed_app_id==installed_app.id,ExtUserApps.is_deleted==False)).first()
        if user_apps is None:
            user_apps=ExtUserApps(
                user_id=current_user.id,
                installed_app_id=installed_app.id
            )
            db.session.add(user_apps)
            db.session.commit()
        return {"result": "success", "installId": installed_app.id}


api.add_resource(UserAppsListApi, "/user-apps")
api.add_resource(UserAppApi, "/user-apps/<uuid:app_id>")
api.add_resource(AppIdToInstallID, "/user-apps/install-id/<uuid:app_id>")