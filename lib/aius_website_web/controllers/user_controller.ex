defmodule AiusWebsiteWeb.UserController do
  use AiusWebsiteWeb, :controller

  alias AiusWebsite.Members
  alias AiusWebsite.Members.User

  action_fallback AiusWebsiteWeb.FallbackController

  plug :authenticate when action not in [:index]

  def index(conn, _params) do
    users = Members.list_users()

    conn
    |> render("index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    params = user_params |> add_author(conn)

    with {:ok, %User{} = user} <- Members.create_user(params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Members.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    params = user_params |> add_author(conn)
    user = Members.get_user!(id)

    with {:ok, %User{} = user} <- Members.update_user(user, params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Members.get_user!(id)

    with {:ok, %User{}} <- Members.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
