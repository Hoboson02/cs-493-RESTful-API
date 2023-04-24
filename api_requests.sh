# GET REQUESTS
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev'
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/'
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1'
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/reviews'
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/photos'
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/info'



# POST REQUESTS

curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6/reviews' \
--header 'Content-Type: application/json' \
--data '{"reviewTest3": {
            "starRating": "5",
            "reviewContent": "It was good",
            "priceRating": "$"
          }}'

curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business' \
--header 'Content-Type: application/json' \
--data '{"testBusiness4":{"reviews":{"reviewTest3":{"starRating":"2","reviewContent":"It was mostly terrible","priceRating":"$$$$"},"reviewTest2":{"starRating":"3","reviewContent":"It was alright","priceRating":"$$$$"},"reviewTest1":{"starRating":"5","reviewContent":"It was the best!","priceRating":"$$$"}},"photos":{},"info":{"zipCode":"97702","address":"1500 SW Chandler Ave.","city":"Bend","name":"OSU-Cascades","phone#":"(541) 322-3100","state":"Oregon","category":"University"}}}'

# Fails because starRating is too high
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness4' \
--header 'Content-Type: application/json' \
--data '{
  "reviewTest79": {
    "starRating": "6",
    "reviewContent": "It was good",
    "priceRating": "$$$"
  }
}'

# Fails because priceRating has too many $ 
curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness4' \
--header 'Content-Type: application/json' \
--data '{
  "reviewTest79": {
    "starRating": "4",
    "reviewContent": "It was good",
    "priceRating": "$$$$$"
  }
}'

# DELETE REQUESTS

curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6'
curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/photos/testPhoto'
curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6/reviews/reviewTest3'


# PUT REQUESTS