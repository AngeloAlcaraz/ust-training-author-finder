import { All, Controller, Req, Res, UseGuards } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import axios from "axios";
import { Request, Response } from "express";
import { AccessTokenGuard } from "src/guards/guard.access_token";

@Controller("favorites")
export class FavoritesProxyController {

    @UseGuards(AccessTokenGuard)
    @ApiExcludeEndpoint()
    @All()
    async proxyRoot(@Req() req: Request, @Res() res: Response) {
        return await this.handleProxyRequest(req, res);
    }

    @UseGuards(AccessTokenGuard)
    @ApiExcludeEndpoint()
    @All('*path')
    async proxyWildcard(@Req() req: Request, @Res() res: Response) {
        return await this.handleProxyRequest(req, res);
    }

    private async handleProxyRequest(req: Request, res: Response) {
        try {
            const targetUrl = `${process.env.FAVORITE_SERVICE_URL}${req.originalUrl.replace(/^\/api\/v1/, '')}`; // Remove the API prefix from the URL
            // Forward the request
            const response = await axios.request({
                method: req.method as any, // Cast to any to avoid type issues with axios
                url: targetUrl,
                headers: {
                    ...req.headers,
                    host: undefined, // Remove host header to avoid conflicts
                    'Content-Length': undefined, // Remove Content-Length to avoid issues with axios
                },
                data: req.body,
                params: req.query,
                validateStatus: () => true, // Accept all status codes
            });
            res.status(response.status).send(response.data);

        } catch (error: any) {
            res.status(502).send({ message: 'Proxy error', error: error.message });
        }
    }
}