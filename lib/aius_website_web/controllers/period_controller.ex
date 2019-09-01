defmodule AiusWebsiteWeb.PeriodController do
  use AiusWebsiteWeb, :controller

  alias AiusWebsite.Term
  alias AiusWebsite.Term.Period

  action_fallback AiusWebsiteWeb.FallbackController

  plug :authenticate when action not in [:index]

  def index(conn, _params) do
    periods = Term.list_periods()
    render(conn, "index.json", periods: periods)
  end

  def create(conn, %{"period" => period_params}) do
    with {:ok, %Period{} = period} <- Term.create_period(period_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.period_path(conn, :show, period))
      |> render("show.json", period: period)
    end
  end

  def show(conn, %{"id" => id}) do
    period = Term.get_period!(id)
    render(conn, "show.json", period: period)
  end

  def update(conn, %{"id" => id, "period" => period_params}) do
    period = Term.get_period!(id)

    with {:ok, %Period{} = period} <- Term.update_period(period, period_params) do
      render(conn, "show.json", period: period)
    end
  end

  def delete(conn, %{"id" => id}) do
    period = Term.get_period!(id)

    with {:ok, %Period{}} <- Term.delete_period(period) do
      send_resp(conn, :no_content, "")
    end
  end
end
