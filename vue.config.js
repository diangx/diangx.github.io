const { defineConfig } = require('@vue/cli-service')

const CUSTOM = require('./env.json')
process.env.STATE = CUSTOM.STATE
process.env.CRYPTO_SERVERADDRESS = CUSTOM.CRYPTO_SERVERADDRESS
process.env.UPBIT_OPEN_API_ACCESS_KEY = CUSTOM.UPBIT_OPEN_API_ACCESS_KEY
process.env.UPBIT_OPEN_API_SECRET_KEY = CUSTOM.UPBIT_OPEN_API_SECRET_KEY
process.env.UPBIT_OPEN_API_SERVER_URL = CUSTOM.UPBIT_OPEN_API_SERVER_URL

module.exports = defineConfig({
    outputDir: 'docs', // 빌드 결과물을 docs 디렉토리에 생성
    publicPath: './',  // 상대 경로로 설정하여 GitHub Pages와 같은 정적 서버에서 문제 방지
    lintOnSave:false,
    transpileDependencies: true,
    chainWebpack: (config) => {
        config.plugin('define').tap((args) => {
            const webpackConfig = args[0];
            webpackConfig['__VUE_PROD_DEVTOOLS__'] = false;
            webpackConfig['__VUE_PROD_HYDRATION_WARNING__'] = false;
            webpackConfig['__VUE_PROD_HYDRATION_MISMATCH__'] = false;
            webpackConfig['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false;

            args[0]['process.env'] = {
                ...args[0]['process.env'],
                STATE: JSON.stringify(process.env.STATE),
                CRYPTO_SERVERADDRESS: JSON.stringify(process.env.CRYPTO_SERVERADDRESS),
                UPBIT_OPEN_API_ACCESS_KEY: JSON.stringify(process.env.UPBIT_OPEN_API_ACCESS_KEY),
                UPBIT_OPEN_API_SECRET_KEY: JSON.stringify(process.env.UPBIT_OPEN_API_SECRET_KEY),
                UPBIT_OPEN_API_SERVER_URL: JSON.stringify(process.env.UPBIT_OPEN_API_SERVER_URL)
            }

            return args;
        });
    }
})
