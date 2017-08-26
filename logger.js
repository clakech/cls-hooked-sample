const cls = require('cls-hooked');

module.exports = message => {
    const ns = cls.getNamespace('sample');
    const correlationId = ns.get('correlationId');
    console.log(`${correlationId} => ${message}`)
};