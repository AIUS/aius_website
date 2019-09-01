defmodule AiusWebsiteWeb.MembershipController do
  use AiusWebsiteWeb, :controller

  alias AiusWebsite.Members
  alias AiusWebsite.Members.Membership

  action_fallback AiusWebsiteWeb.FallbackController

  plug :authenticate when action not in [:index]

  def index(conn, %{"user_id" => user_id}) do
    user = Members.get_user!(user_id)
    render(conn, "index.json", memberships: user.memberships)
  end

  def create(conn, %{"user_id" => user_id, "membership" => membership_params}) do
    user = Members.get_user!(user_id)
    with {:ok, %Membership{} = membership} <- Members.create_membership(user, membership_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_membership_path(conn, :show, user_id, membership))
      |> render("show.json", membership: membership)
    end
  end

  def show(conn, %{"user_id" => user_id, "id" => id}) do
    membership = Members.get_user!(user_id)
                 |> Members.get_membership!(id)
    render(conn, "show.json", membership: membership)
  end

  def update(conn, %{"user_id" => user_id, "id" => id, "membership" => membership_params}) do
    membership = Members.get_user!(user_id)
                 |> Members.get_membership!(id)

    with {:ok, %Membership{} = membership} <- Members.update_membership(membership, membership_params) do
      render(conn, "show.json", membership: membership)
    end
  end

  def delete(conn, %{"user_id" => user_id, "id" => id}) do
    membership = Members.get_user!(user_id)
                 |> Members.get_membership!(id)

    with {:ok, %Membership{}} <- Members.delete_membership(membership) do
      send_resp(conn, :no_content, "")
    end
  end
end
