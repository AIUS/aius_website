defmodule AiusWebsiteWeb.MembershipView do
  use AiusWebsiteWeb, :view
  alias AiusWebsiteWeb.MembershipView
  alias AiusWebsiteWeb.PeriodView

  def render("index.json", %{memberships: memberships}) do
    %{data: render_many(memberships, MembershipView, "membership.json")}
  end

  def render("show.json", %{membership: membership}) do
    %{data: render_one(membership, MembershipView, "membership.json")}
  end

  def render("membership.json", %{membership: membership}) do
    %{id: membership.id,
      valid: membership.valid,
      period: render_one(membership.period, PeriodView, "period.json")}
  end
end
