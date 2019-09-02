defmodule AiusWebsiteWeb.Auth do
  import Plug.Conn

  def add_author(params, conn) do
    Map.put(params, "author", conn.assigns.claims["sub"])
  end

  def authenticate(conn, _) do
    with {:ok, token} <- extract_token(conn),
         {:ok, claims} <- OpenIDConnect.verify(:aius, token) do
      conn
      |> assign(:claims, claims)
    else
      _err ->
        conn
        |> AiusWebsiteWeb.FallbackController.call({:error, :unauthorized})
        |> halt
    end
  end

  defp extract_token(conn) do
    case Plug.Conn.get_req_header(conn, "authorization") do
      [auth_header] -> get_token_from_header(auth_header)
      _ -> {:error, :missing_auth_header}
    end
  end

  defp get_token_from_header(auth_header) do
    {:ok, reg} = Regex.compile("Bearer\:?\s+(.*)$", "i")

    case Regex.run(reg, auth_header) do
      [_, match] -> {:ok, String.trim(match)}
      _ -> {:error, "token not found"}
    end
  end
end
