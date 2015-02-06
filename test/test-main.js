require.config({
    baseUrl: './base/test/assets',
    packages: [
        {
            name: 'ioc',
            location: '../../src'
        }
    ],
    paths: {
        jquery: 'https://ss0.bdstatic.com/5a21bjqh_Q23odCf/static/superplus/js/lib/jquery-1.10.2_d88366fd'
    }
});

define.amd.jQuery = true;