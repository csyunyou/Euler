## 使用指南
1. 下载npm
2. 控制台切换到Euler/myServer,然后npm install,最后npm start,后台服务器在端口3000监听
3. 控制台切换到Euler/jsworkshop,然后npm install,最后npm run dev，前端服务器在8080端口监听
4. 打开浏览器输入:<span>http://localhost:8080,</span>前端服务器监听到以后开始计算并生成数据，该数据通过ajax送到后台服务器
5. 后台服务器监听到以后将数据写入myServer/public路径下的output.brp文件
6. end# Euler
