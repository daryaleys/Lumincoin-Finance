const path = require('path')

export default {
    root: path.resolve(__dirname, 'src'),
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '~datepicker': path.resolve(__dirname, 'node_modules/bootstrap-datepicker'),
        }
    },
    server: {
        port: 8080,
        hot: true
    }
}