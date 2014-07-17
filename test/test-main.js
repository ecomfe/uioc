require.config({
    baseUrl: './base/test/assets',
    packages: [
        {
            name: 'ioc',
            location: '../../src'
        }
    ],
    paths: {
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery'
    }
});

define.amd.jQuery = true;