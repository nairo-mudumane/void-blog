import { ENV } from '@/lib/zod'
import { ServerRoutes } from '@/routes'
import cors from 'cors'
import express from 'express'

const server = express()
const knownOrigins = ENV.KNOWN_ORIGINS.split(',')

server.use(express.json())
server.use(cors({ origin: knownOrigins, optionsSuccessStatus: 200 }))
ServerRoutes(server)

server.listen(ENV.PORT, () => console.log(`server running on ${ENV.PORT}`))
