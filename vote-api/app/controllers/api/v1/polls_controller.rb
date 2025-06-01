class Api::V1::PollsController < ApplicationController
  # GET /api/v1/polls
  def index
    render json: Poll.all, include: :votes
  end

  # GET /api/v1/polls/:id
  def show
    poll = Poll.find(params[:id])
    opts = poll.votes.pluck(:option).uniq
    render json: poll.as_json.merge(options: opts), include: :votes
  end

  # POST /api/v1/polls
  def create
    poll = Poll.new(title: poll_params[:title])
    if poll.save
      (poll_params[:options] || []).each { |opt| poll.votes.create!(option: opt) }
      render json: poll, include: :votes, status: :created
    else
      render json: { errors: poll.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/polls/:id
  def update
    poll = Poll.find(params[:id])
    if poll.update(title: poll_params[:title])
      new_opts = poll_params[:options] || []
      old_opts = poll.votes.pluck(:option).uniq

      # удаляем опции
      (old_opts - new_opts).each { |opt| poll.votes.where(option: opt).destroy_all }
      # добавляем новые
      (new_opts - old_opts).each { |opt| poll.votes.create!(option: opt) }

      opts = poll.votes.pluck(:option).uniq
      render json: poll.as_json.merge(options: opts), include: :votes
    else
      render json: { errors: poll.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def poll_params
    params.require(:poll).permit(:title, options: [])
  end
end
