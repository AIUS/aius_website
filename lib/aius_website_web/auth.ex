defmodule AiusWebsiteWeb.Auth do
  import Plug.Conn

  def add_author(params, conn) do
    Map.put(params, "author", conn.assigns.claims["sub"])
  end

  def authenticate(conn, _) do
    if Mix.env == :test do
      # TODO: valid/invalid tokens?
      conn
      |> assign(:claims, %{"sub" => "test"})
    else
      with {:ok, token} <- extract_token(conn),
           {:ok, claims} <- OpenIDConnect.verify(:aius, token),
           :ok <- verify_exp(claims) do
        conn
        |> assign(:claims, claims)
      else
        {:error, reason} ->
          conn
          |> AiusWebsiteWeb.FallbackController.call({:error, :unauthorized, reason})
          |> halt
        _err ->
          conn
          |> AiusWebsiteWeb.FallbackController.call({:error, :unauthorized})
          |> halt
      end
    end
  end

  defp verify_exp(%{"exp" => exp}) do
    with {:ok, dt} <- DateTime.from_unix(exp),
         :lt <- DateTime.compare(DateTime.utc_now(), dt) do
      :ok
    else
      :gt -> {:error, "token expired"}
      :eq -> {:error, "token expired"}
      err -> err
    end
  end
  defp verify_exp(_), do: {:error, "expiration not found"}

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
