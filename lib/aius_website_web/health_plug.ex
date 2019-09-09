defmodule AiusWebsiteWeb.HealthPlug do
  import Plug.Conn

  def init(opts), do: opts
  def call(conn, _), do: conn |> put_resp_content_type("text/plain") |> send_resp(200, "ok")
end
