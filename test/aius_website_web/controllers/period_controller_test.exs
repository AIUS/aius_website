defmodule AiusWebsiteWeb.PeriodControllerTest do
  use AiusWebsiteWeb.ConnCase

  alias AiusWebsite.Term
  alias AiusWebsite.Term.Period

  @create_attrs %{
    end: ~D[2010-04-20],
    start: ~D[2010-04-17]
  }
  @update_attrs %{
    end: ~D[2011-05-22],
    start: ~D[2011-05-18]
  }
  @invalid_attrs %{end: nil, start: nil}

  def fixture(:period) do
    {:ok, period} = Term.create_period(@create_attrs)
    period
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all periods", %{conn: conn} do
      conn = get(conn, Routes.period_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create period" do
    test "renders period when data is valid", %{conn: conn} do
      conn = post(conn, Routes.period_path(conn, :create), period: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.period_path(conn, :show, id))

      assert %{
               "id" => id,
               "end" => "2010-04-20",
               "start" => "2010-04-17"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.period_path(conn, :create), period: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update period" do
    setup [:create_period]

    test "renders period when data is valid", %{conn: conn, period: %Period{id: id} = period} do
      conn = put(conn, Routes.period_path(conn, :update, period), period: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.period_path(conn, :show, id))

      assert %{
               "id" => id,
               "end" => "2011-05-22",
               "start" => "2011-05-18"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, period: period} do
      conn = put(conn, Routes.period_path(conn, :update, period), period: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete period" do
    setup [:create_period]

    test "deletes chosen period", %{conn: conn, period: period} do
      conn = delete(conn, Routes.period_path(conn, :delete, period))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.period_path(conn, :show, period))
      end
    end
  end

  defp create_period(_) do
    period = fixture(:period)
    {:ok, period: period}
  end
end
