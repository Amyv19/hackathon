import tweepy

# Sustituye estos valores por tus credenciales
API_KEY = 'P9ZYmDdCBLFxVKaA3JO8Y4Srl'
API_SECRET_KEY = 'PyHFpslL4NFDIix2iaTiM5zgDY9dmO4mjwrZvHx0niVh94HIaJ'
ACCESS_TOKEN = '1842314403762622464-lYcVhcQ0VR0a8q6UC7cZGEAnnYRpuc'
ACCESS_TOKEN_SECRET = 'g7oWTSecUMT5L34RAzbAa181mjcottEyuf759Yn64MJTM'

# Autenticación
auth = tweepy.OAuth1UserHandler(API_KEY, API_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

# Crear el cliente
api = tweepy.API(auth)

# Verifica si la autenticación fue exitosa
try:
    api.verify_credentials()
    print("Autenticación exitosa")
except Exception as e:
    print("Error en la autenticación", e)

# Configura el cliente de streaming
streaming_client = tweepy.StreamingClient(bearer_token="AAAAAAAAAAAAAAAAAAAAABLxwAEAAAAAbfCcYMRcntEgjTiUBnSLyJWnBJM%3DcFX3yFMoJPuNWmofzKqZs2sAEzMwhn2OjOOBNGB5j4BbXQc6F7")

# Agrega reglas para el streaming
streaming_client.add_rules(tweepy.StreamRule("flood OR inundación"))

# Comienza a escuchar el stream
streaming_client.filter()
