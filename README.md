# utools-file-to-folder
uTools工具的插件，使用超级面板，选中文件或文件夹并自动移动或复制到一个新建文件夹中，也可以指定已经存在的文件夹

### 截图

使用超级面板，选中文件

![image-20220730153516198](https://git.mengqingpo.com:8888/fugary/blogpic/uploads/79c075dd4a10efe4d91276728427780c/image-20220730153516198.png)

输入文件名等操作

![image-20220730154722043](https://git.mengqingpo.com:8888/fugary/blogpic/uploads/925a9dafa9adf550240f79484bb7a4d2/image-20220730154722043.png)

然后执行移动或者复制。

优化代码，增加黑色主题模式。

utools打包不要包含`git`等其他文件，可以使用`npm run build`输出到`dist`目录，用`dist`目录打包

`npm run clean`——清理`dist`目录