defmodule AiusWebsiteWeb.AuthController do
  use AiusWebsiteWeb, :controller

  def uri(conn, _) do
    jwk = GenServer.call(:openid_connect, {:jwk, :aius})
    {_, jwk} = JOSE.JWK.to_map(jwk)

    keys =
      Enum.map(jwk["keys"], fn j ->
        {_, pem} = JOSE.JWK.to_pem(j)
        Map.put(j, "pem", pem)
      end)

    uri =
      OpenIDConnect.authorization_uri(:aius, %{
        redirect_uri: Routes.url(conn),
        nonce: hd(Plug.Conn.get_resp_header(conn, "x-request-id"))
      })

    render(conn, "index.json", authorization_uri: uri, jwk: keys)
  end
end
