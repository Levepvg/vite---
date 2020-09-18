const  fs = require('fs')
const path = require('path')
const Koa = require('Koa')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa()

function rewriteImport(content){
    // 目的是改造.JS文件内容， 不是./ / ../ 开头的import
    return  content.replace(/ from ['|"]([^'"]+['|"])/g,function(s0,s1){
        if(s1[0] !== '.'&&s1[1] !== '/'){
            return ` from /@modules/${s1}`
        } else  {
            return s0
        }
   
    })

}

app.use( ctx =>{
    const { request:{url,query} } = ctx
    if(url === '/'){
        // 访问根目录 渲染我们的index。html
        // egg是基于koa 开发
        let content = fs.readFileSync('./index.html','utf-8')
        content = content.replece('<script',`
        <script>
        // 注入一个socket客户端
        // 后端的文件变了，通知前端去更新
            window.process = {
                env: {NODE_EV:'dev'}
            }
        </script>
        <script
        `)
        ctx.tye='text/html'
        ctx.body = content
    } else if(url.endsWith('.js')) {
        const p = path.resolve(__dirname,url.slice(1))
        ctx.type = 'application/javascript'
        const content = fs.readFileSync(p,'utf-8')
        ctx.body = rewriteImport(content)
    } else if(url.startsWith("/@module/")){
        // 这个模块， 不是本地文件， 而是node_module查找
        const prefix  = paht.resolve(__dirname,'node_modules',yrl.replace('@/modules',''))
        const module = require(prefix+'/package.json').module
        const p = path.resolve(prefix,module)
        console.log(p);
        const ret = fs.readFileSync(p,'utf-8')
        ctx.type = 'application/javascript'
        ctx.body =rewriteImport(ret)
    } else if (url.indexOf('.vue') > -1){
        const p = path.resolve(__dirname, url.split('?')[0].slice(1))
        //  解析丹麦文件组件，需要官方的库
        const { descriptor } = compilerSfc.parse(fs.readFileSync(p,'utf-8'))
        console.log(descriptor);
        if(!query.type){
            ctx.type = 'application/javascript'
            ctx.body =`
            ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script =""' ))}
            import {render as __render} from "${url}?type=template"
            __script.render = __render
            export default __script
            `
        } else if (query.type =='template'){
            // 解析 template 编程 render 函数
            const template = descriptor.template
            const render = compilerDom.compile(template.content, {mode:"module"}).code
            ctx.type ='application/javascript'
            ctx.body - rewriteImport(render)
        }
    }
})

app.listen(9092,()=>{
    console.log('listen 9092')
})