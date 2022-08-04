window.onload = function () {
    Vue.createApp({
        data() {
            return {
                filesData: [],
                folderName: ''
            }
        },
        methods: {
            selectFolderName() {
                const directoryNames = utools.showOpenDialog({ properties: ['openDirectory'] });
                if (directoryNames && directoryNames.length) {
                    this.folderName = directoryNames[0];
                }
            },
            clearFileNames() {
                this.filesData = [];
                this.folderName = '';
            },
            moveOrCopyFile(copy) {
                window.moveOrCopyFile(this.filesData, this.folderName, copy);
                utools.showNotification(copy ? '文件或文件夹复制完成' : '文件或文件夹移动完成');
                this.clearFileNames();
            },
            dragFiles(e) {
                if (e.dataTransfer && e.dataTransfer.files) {
                    for (let dragFile of e.dataTransfer.files) {
                        const file = {
                            name: dragFile.name,
                            path: dragFile.path
                        };
                        window.checkDragFile(file);
                        if(!this.checkExistsFile(file)){
                            this.filesData.push(file);
                        }
                    }
                }
            },
            checkExistsFile(file) {
                return !!this.filesData.find(existsFile => existsFile.path === file.path);
            },
            removeFileFromList(file) {
                const idx = this.filesData.indexOf(file);
                this.filesData.splice(idx, 1);
            }
        },
        mounted() {
            utools.onPluginEnter(({ code, type, payload, optional }) => {
                console.log('用户进入插件', code, type, payload)
                if (type === "files") {
                    this.filesData = payload || []
                }
                document.documentElement.className = utools.isDarkColors() ? 'dark' : ''
            });
        }
    }).mount("#app");
}