require "test_helper"

class Api::V1::VotesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_votes_create_url
    assert_response :success
  end
end
