#!/bin/bash
# # GET REQUESTS
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev'
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/'
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1'
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/reviews'
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/photos'
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/info'



# # POST REQUESTS

# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6/reviews' \
# --header 'Content-Type: application/json' \
# --data '{"reviewTest3": {
#             "starRating": "5",
#             "reviewContent": "It was good",
#             "priceRating": "$"
#           }}'

# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business' \
# --header 'Content-Type: application/json' \
# --data '{"testBusiness4":{"reviews":{"reviewTest3":{"starRating":"2","reviewContent":"It was mostly terrible","priceRating":"$$$$"},"reviewTest2":{"starRating":"3","reviewContent":"It was alright","priceRating":"$$$$"},"reviewTest1":{"starRating":"5","reviewContent":"It was the best!","priceRating":"$$$"}},"photos":{},"info":{"zipCode":"97702","address":"1500 SW Chandler Ave.","city":"Bend","name":"OSU-Cascades","phone#":"(541) 322-3100","state":"Oregon","category":"University"}}}'

# # Fails because starRating is too high
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness4' \
# --header 'Content-Type: application/json' \
# --data '{
#   "reviewTest79": {
#     "starRating": "6",
#     "reviewContent": "It was good",
#     "priceRating": "$$$"
#   }
# }'

# # Fails because priceRating has too many $ 
# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness4' \
# --header 'Content-Type: application/json' \
# --data '{
#   "reviewTest79": {
#     "starRating": "4",
#     "reviewContent": "It was good",
#     "priceRating": "$$$$$"
#   }
# }'

# # DELETE REQUESTS

# curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6'
# curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness1/photos/testPhoto'
# curl --location --request DELETE 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6/reviews/reviewTest3'


# # PUT REQUESTS

# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business/testBusiness6/reviews' \
# --header 'Content-Type: application/json' \
# --data '{"reviewTest3": {
#             "starRating": "5",
#             "reviewContent": "It was good",
#             "priceRating": "$"
#           }}'

# curl --location 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev/business' \
# --header 'Content-Type: application/json' \
# --data '{"testBusiness4":{"reviews":{"reviewTest3":{"starRating":"2","reviewContent":"It was mostly terrible","priceRating":"$$$$"},"reviewTest2":{"starRating":"3","reviewContent":"It was alright","priceRating":"$$$$"},"reviewTest1":{"starRating":"5","reviewContent":"It was the best!","priceRating":"$$$"}},"photos":{},"info":{"zipCode":"97702","address":"1500 SW Chandler Ave.","city":"Bend","name":"OSU-Cascades","phone#":"(541) 322-3100","state":"Oregon","category":"University"}}}'

# # Add New User

# url="https://7pophi9tm0.execute-api.us-west-2.amazonaws.com/main/user"
# username="RyanEarl2"
# password="Testpassword123!"

# curl -X POST "$url" \
#   -H "Content-Type: application/json" \
#   -d "{\"username\":\"$username\",\"password\":\"$password\"}"

# User Login
# apiUrl='https://7pophi9tm0.execute-api.us-west-2.amazonaws.com/main/user/login'
# username='RyanEarl2'
# password='Testpassword123!'
# # Valid Credentials
# echo "Testing with valid credentials"
# response=$(curl -s -X POST $apiUrl -d "{\"username\":\"$username\",\"password\":\"$password\"}")
# echo "Response: $response"

# # Invalid Credentials
# echo "Testing with invalid credentials"
# response=$(curl -s -X POST $apiUrl -d "{\"username\":\"invalid\",\"password\":\"invalid\"}")
# echo "Response: $response"

# GET Requests with proper JWT
apiUrl='https://7pophi9tm0.execute-api.us-west-2.amazonaws.com/main/user/4ca62aa0-eb4e-4158-96ae-5027934d21e1'
idToken='eyJraWQiOiJURVJxbU9YSUtjaTIwQ1wvczdkZmtcL0NZY2lWYTZoS21ueDBndkpKTldrWkE9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiM2MxMzNkNmItNjgwMC00NGRjLWE2ZDYtZjU3NWU3N2M1OWEyIiwic3ViIjoiNGNhNjJhYTAtZWI0ZS00MTU4LTk2YWUtNTAyNzkzNGQyMWUxIiwiYXVkIjoiNTNjZWx2bTA5dWN1aDRjcGl1aTd1Z3R2djIiLCJldmVudF9pZCI6IjcyOWUzZDY0LTU4ZmEtNGEwOS1iMGM5LWMyNTE3YzNmZTFlMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjg0OTAyMTIzLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9la29oN3RtejAiLCJjb2duaXRvOnVzZXJuYW1lIjoiUnlhbkVhcmwyIiwiZXhwIjoxNjg0OTA1NzIzLCJpYXQiOjE2ODQ5MDIxMjMsImp0aSI6ImFhMTY2YjIwLTJjMTgtNDY3Yi1iMDg4LTk1NzRkOGEwNWI4ZiJ9.betta6Bobx3Za7LJsjw4_23-CBA2DlisLztsJruaDhZU8PgTP0ux3zHTyzKkK09hRVHVKTd43qpdwPLrweA1PeWCKDgBMUfpTG6rePQzBdPnZxB1zf1ZCJEfNqgG8UbkNUnIS4BLj-1-bepeSF865rKHgNldLG0O3h-0eolE6RiBdjG9NWVQ_nO5vMwLXvEkx1pjanmOLce5P-XeD3Ll-1zTg0Y3OARCBXmuLLoeUrBUiCrtqJIv2louMvZm7ehYNam_8TB6yzKvVQT7aca2WEmDkwJTj1X5MXvT8BcouvcsOjLYWOVKLiRayuorxH6V1TvsQPM9x015c4hN-TPX1g'

response=$(curl -s -X GET -H "Content-Type: application/json" -H "Authorization: $idToken" $apiUrl)

echo "Response: $response"