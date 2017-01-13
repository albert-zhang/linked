import FileFormat from './file-format'
import Store from './store'
import Desktop from './components/desktop/vue.vue'
import Tools from './components/tools/vue.vue'

import shelljs from 'shelljs'
import os from 'os'
import path from 'path'
import fs from 'fs'

const {Menu, app, dialog} = require('electron').remote

export default {
    name: 'app',
    components: {
        Desktop,
        Tools
    },
    data() {
        return {
            data: FileFormat
        }
    },
    computed: {
    },
    created() {
        this.data = {}
        this.createAppMenu()

        this.loadFile('/Users/yangzhang/Desktop/file-linked') // ///////////////////////////////////////////////////////
    },
    methods: {
        createAppMenu() {
            const self = this
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'Open...',
                            click() {
                                self.onOpenFileMenuAction()
                            }
                        }
                    ]
                },
                {
                    label: 'Edit',
                    submenu: [
                        {
                            role: 'undo'
                        },
                        {
                            role: 'redo'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'cut'
                        },
                        {
                            role: 'copy'
                        },
                        {
                            role: 'paste'
                        },
                        {
                            role: 'pasteandmatchstyle'
                        },
                        {
                            role: 'delete'
                        },
                        {
                            role: 'selectall'
                        }
                    ]
                }
            ]
            if (process.platform === 'darwin') {
                template.unshift({
                    label: app.getName(),
                    submenu: [
                        {
                            role: 'about'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'hide'
                        },
                        {
                            role: 'hideothers'
                        },
                        {
                            role: 'unhide'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'quit'
                        }
                    ]
                })
            }

            const menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
        },

        onOpenFileMenuAction() {
            const r = dialog.showOpenDialog({
                properties: ['openDirectory'], // openFile
                filters: [
                    {name: 'Linked Files', extensions: ['linked']}
                ]})
            let f = null
            if ((r instanceof Array) && r.length === 1) {
                f = r[0]
            }
            if (!f) {
                return
            }
            this.loadFile(f)
        },

        loadFile(f) {
            try {
                Store.setFileRoot(f)
                const cfg = path.resolve(f, 'data.linked')
                const jsonStr = fs.readFileSync(cfg).toString()
                this.data = JSON.parse(jsonStr)
            } catch (ex) {
                window.alert(ex.message)
            }
        },

        onAddImg(f) {
            shelljs.cp(f.path, `${Store.fileRoot}/123.jpg`)
            this.data.imgs.push({
                id: '123',
                file: '123.jpg',
                x: 0,
                y: 0,
                width: 100,
                height: 100
            })
        }
    }
}
