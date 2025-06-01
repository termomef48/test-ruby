poll = Poll.create!(title: "Your favorite programming language?")
poll.votes.create!(option: "Ruby")
poll.votes.create!(option: "JS")
poll.votes.create!(option: "Python")

poll = Poll.create!(title: "Best frontend framework?")
poll.votes.create!(option: "React")
poll.votes.create!(option: "Vue")
poll.votes.create!(option: "Angular")

poll = Poll.create!(title: "Best backend framework?")
poll.votes.create!(option: "Rails")
poll.votes.create!(option: "Django")
poll.votes.create!(option: "Express")

poll = Poll.create!(title: "Best database?")
poll.votes.create!(option: "PostgreSQL")
poll.votes.create!(option: "MySQL")
poll.votes.create!(option: "MongoDB")