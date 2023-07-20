module.exports = (args, env, dir = process.cwd()) => {
    return require('@mappable-world/mappable-cli/webpack.config')(args, env, dir);
}
