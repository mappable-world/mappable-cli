module.exports = (args, env, dir = process.cwd()) => {
    return require('@mappable-world/mappable-test-utils/webpack.config')(args, env, dir);
}
