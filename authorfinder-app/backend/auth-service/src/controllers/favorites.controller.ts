import { All, Controller, Req, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import axios from "axios";
import { Request, Response } from "express";

@Controller("favorites")
export class FavoritesProxyController {

    @All()
    async proxyRoot(@Req() req: Request, @Res() res: Response) {
        console.log(`Received request for: ${req.originalUrl}`);
        this.handleProxyRequest(req, res);
    }

    //@ApiExcludeEndpoint()
    @All('*path')
    async proxyWildcard(@Req() req: Request, @Res() res: Response) {
        console.log(`Received wildcard request for: ${req.originalUrl}`);
        this.handleProxyRequest(req, res);
    }

    private async handleProxyRequest(req: Request, res: Response) {
        console.log(`Received request for: ${req.originalUrl}`);
        try {
            // Build the target URL for Favorites Service
            const targetUrl = `${process.env.FAVORITE_SERVICE_URL}${req.originalUrl}`;
            console.log(`Proxying request to: ${targetUrl}`);
            // Forward the request
            const response = await axios.request({
                method: req.method as any, // Cast to any to avoid type issues with axios
                url: targetUrl,
                headers: {
                    ...req.headers,
                    host: undefined, // Remove host header to avoid conflicts
                },
                data: req.body,
                params: req.query,
                validateStatus: () => true, // Accept all status codes
            });
            console.log(`Response from Favorites Service: ${response.status} ${response.statusText}`);
            res.status(response.status).send(response.data);

        } catch (error: any) {
            res.status(502).send({ message: 'Proxy error', error: error.message });
        }
    }
}