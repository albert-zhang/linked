import fs from 'fs'
// import trash from 'trash'

export default {
    copyFile(src, dest) {
        // fs.createReadStream(src).pipe(fs.createWriteStream(dest))

        // http://procbits.com/2011/11/15/synchronous-file-copy-in-node-js
        const BUF_LENGTH = 64 * 1024
        const buff = new window.Buffer(BUF_LENGTH)
        const fdr = fs.openSync(src, 'r')
        const fdw = fs.openSync(dest, 'w')
        let bytesRead = 1
        let pos = 0
        while (bytesRead > 0) {
            bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos)
            fs.writeSync(fdw, buff, 0, bytesRead)
            pos += bytesRead
        }
        fs.closeSync(fdr)
        fs.closeSync(fdw)
    }

    // moveFileToTrash(src) {
    //     trash([src])
    // }
}
