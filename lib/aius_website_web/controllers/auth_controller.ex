defmodule AiusWebsiteWeb.AuthController do
  use AiusWebsiteWeb, :controller

  def uri(conn, _) do
    uri =
      OpenIDConnect.authorization_uri(:aius, %{
        redirect_uri: Routes.url(conn),
        nonce: hd(Plug.Conn.get_resp_header(conn, "x-request-id"))
      })

    render(conn, "index.json", authorization_uri: uri)
  end
end
