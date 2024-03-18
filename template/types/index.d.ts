declare module '@mappable-world/mappable-types/import' {
    interface Import {
        (pkg: '%PACKAGE_NAME%'): Promise<typeof import('../src/index')>;
    }
}

export {};
