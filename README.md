# LiliGPT Backend

This project contains a REST API and a Websockets Server.

## Authenticate from vscode

In order to authenticate through vscode, you need to follow these steps:

1. Connect to websockets at port `28181`.
2. Emit an event `vscode:register-for-auth` with a string `nonce` as payload.
3. Open the external url for LiliGPT authentication service at: `https://liligpt-website.giovannefeitosa.com/vscode/authenticate?nonce={nonce}`
4. The server will respond with an event `vscode:auth` with `ISharedVscodeAuth`.

```typescript
interface ISharedVscodeAuth {
  accessToken: string;
  refreshToken: string;
}
```

> Note that the `vscode:auth` event will only be emitted once after this server receives a POST request at `/vscode/send-auth-to-vscode` from the authentication server.

## Send auth from authentication server

In order to send the authentication to vscode, you need to send a POST request to `/vscode/send-auth-to-vscode` with the following payload:

```typescript
interface ISendAuthToVSCode {
  nonce: string;
  accessToken: string;
  refreshToken: string;
}
```

> Important: If the nonce is not found, the server will respond with a `400` status code.

> Important: VSCode needs to be connected to the websocket server with the right nonce in order to receive the authentication.
