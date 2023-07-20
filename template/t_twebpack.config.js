module.exports = (args, env, dir = process.cwd()) => {
    return require('@mappable-world/mappable-package-utils/webpack.config')(args, env, dir);
}
