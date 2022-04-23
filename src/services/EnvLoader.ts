const { REACT_APP_ENV } = process.env;

const configMap = {
    dev: {
        serverBase: "dev",
    },
    prov: {
        serverBase: "prov",
    },
    test: {
        serverBase: "test",
    }
};


export function envGet(key: string) {
    console.log(REACT_APP_ENV);
    return configMap[REACT_APP_ENV || "dev"][key];
}