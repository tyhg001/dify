- 提交代码git commit --no-verify -m "merge main"

## 用到的相关表
- apps 记录所有的智能体
- installed_apps 记录已经安装的智能体 和上面有什么区别还未知
- conversations 记录会话
    - 1.增加字段user_app_id用来记录会话指向的智能体
- messages 记录会话中的内容
- sites 记录站点信息?

## 工作空间（租户相关）
- tenants 记录租户列表
- tenant_account_joins 记录租户和账号的关系

## 计划修改项
- []增加一个用户收藏的智能体列表，可以自己删除,先不处理
- []修正对话历史的标题，明天改
- 去除设置相关信息，明天改
- 去除登陆email的限制，明天改

## 启动命名
- flask db upgrade
- flask run --host 0.0.0.0 --port=5001 --debug
- celery -A app.celery worker -P solo --without-gossip --without-mingle -Q dataset,generation,mail,ops_trace --loglevel INFO
- celery -A app.celery worker --without-gossip --without-mingle -Q dataset,generation,mail,ops_trace --loglevel INFO (多线程)
