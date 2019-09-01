defmodule AiusWebsiteWeb.UserView do
  use AiusWebsiteWeb, :view
  alias AiusWebsiteWeb.UserView
  alias AiusWebsiteWeb.MembershipView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      subscribed: user.subscribed,
      memberships: render_many(user.memberships, MembershipView, "membership.json")
    }
  end
end
