const http = require('http')
const SerialPort = require("serialport")
const Readline = SerialPort.parsers.Readline
const sp = new SerialPort("/dev/serial0", {
    baudRate: 115200
})
const parser = new Readline()
sp.pipe(parser)

parser.on('data', (line) => {
    console.log(`line : ${line}`)
})

const write = (data) => {
    return new Promise((resolve, reject)=> {
        console.log(`data = ${data}`)
        sp.write(Buffer.from(data),(err,result)=>{
        if(err) {
            console.log(`err = ${err}`)
            console.log(`result = ${result}`)
            reject(err,result)
        } else {
            resolve('')
        }
    })
    })
}
const delay = (wait) => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('')
        },wait)
    })
}
const write_num = async (num) => {
    
}
sp.on("open", async () => {
    console.log(`Serial open`)
    //write()
    await write([128])
    await delay(200)
    await write([131])
    await delay(200)
    //await write([145,0x00,0x90,0x0,0x90])
    //setTimeout(async ()=>{
     //   await write([131]) 
      //  await write([173])
    //},4000)
})
const roombaStop = async () => {

    await write([145,0x00,0x0,0x0,0x0])
    await write([131])
    await delay(200)


}

const roombaForward = async () => {
    await write([145,0x00,0x90,0x0,0x90])
    await delay(200)
}
const server = http.createServer()

const roombaRight = async () => {
    await wirte([145,0,0,0x0,0x90])
    await delay(200)
}

server.on('request',(req,res)=>{
    console.log(`req.url = ${req.url}`)
    if(req.url.startsWith('/stop')) {
        roombaStop()
    }
    if(req.url.startsWith('/forward')) {
        roombaForward()
    }
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.write("Hello world!\n")
    res.end()
})

server.listen(3000)
