defmodule AiusWebsiteWeb.PeriodView do
  use AiusWebsiteWeb, :view
  alias AiusWebsiteWeb.PeriodView

  def render("index.json", %{periods: periods}) do
    %{data: render_many(periods, PeriodView, "period.json")}
  end

  def render("show.json", %{period: period}) do
    %{data: render_one(period, PeriodView, "period.json")}
  end

  def render("period.json", %{period: period}) do
    %{id: period.id, start: period.start, end: period.end}
  end
end
