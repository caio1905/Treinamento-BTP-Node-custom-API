//Iniciando aplicação Node com express
const express = require("express")
const app = express()

//Colocando Segurança na API, solicitando os pacotes de serviços SAP
const passport = require("passport")
const xsenv = require("@sap/xsenv")

//Usando os pacotes SAP
const JWTStrategy = require("@sap/xssec").JWTStrategy
const services = xsenv.getServices({ uaa : 'api-node-uaa'})
passport.use(new JWTStrategy(services.uaa))

//Solicitando as variaveis de ambiente BTP 
const sDestination = process.env.destination
const sUrl = process.env.url
const sApiKey = process.env.ApiKey
const sApiHost = process.env.ApiHost

//Solicitando Dados da Destination no BTP
const SapCfAxios = require("sap-cf-axios").default
const axiosFootball = SapCfAxios(sDestination)

const port = process.env.PORT || 8080

//Usando o modelo oAuth 2.0 na API
app.use(passport.initialize())
app.use(passport.authenticate('JWT', { session : false}))

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

app.get('/Ligas/Pernambucano', async(req, res) => {
    const options = {
        method : 'GET',
        url : sUrl,
        headers : {
            'X-RapidAPI-Key': sApiKey,
            'X-RapidAPI-Host': sApiHost
        }
    }

    try{
        const resultados = await axiosFootball(options);

        console.log(resultados.data)

        res.status(200).json(resultados.data);
    }catch (err) {
        res.status(500).json(err)
    }
})

app.listen(port, () => {
    console.log(`App listen at port ${port}`);
})