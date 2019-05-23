require('isomorphic-fetch');
const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const xlsx = require('xlsx');

const port = parseInt(process.env.PORT, 10) || 3000;

function createServer() {
  const server = new Koa();
  var router = Router();
  server.use(session(server));
  
  router.get('/', async (ctx) => {
    ctx.body = 'hello';
    ctx.res.statusCode = 200;
    return
  });

  router.get('/reports/returns', async (ctx, next) => {

    var data = [['Order Number', 'Customer Email', 'Created At', 'Sub Total', 'Shipping'],
                [1, 'test1@testmail.com', '5/18/2019', '$700.00', '$21.00']]

    let workbook = xlsx.utils.book_new();

    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');

    ctx.set('Content-Disposition', 'attachment; filename=' + 'report_sample.xlsx');
    ctx.set('Content-Type',  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    var wbbuf = xlsx.write(workbook, {
      type: 'base64'
    });
    ctx.body = Buffer.from(wbbuf, 'base64')
  })

  router.get('*', async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes()).use(router.allowedMethods());

  return server;
}

const server = createServer();
module.exports = server;
