defmodule AiusWebsiteWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use AiusWebsiteWeb, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(AiusWebsiteWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
  end

  def call(conn, {:error, :unauthorized}), do: call(conn, {:error, :unauthorized, "undefined"})
  def call(conn, {:error, :unauthorized, reason}) do
    conn
    |> put_status(:forbidden)
    |> put_view(AiusWebsiteWeb.ErrorView)
    |> put_resp_header("x-reason", reason)
    |> render(:"403")
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(AiusWebsiteWeb.ErrorView)
    |> render(:"404")
  end
end
