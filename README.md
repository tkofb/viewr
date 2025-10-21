# viewr 

## overview

this project lets you stream your favorite movies and tv shows locally in one place, featuring episode tracking, media favorites, and personalized recommendations.

## dependencies

- [python](https://www.python.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) 
- [pytube](https://github.com/pytube/pytube)
- [spotipy](https://github.com/spotipy-dev/spotipy)

## pre-requisites

#### 1. create a spotify developer account
1. go to the [spotify for developers website](https://developer.spotify.com/). 
2. click **log in** or **sign up** to create a spotify account if you don’t already have one. 
3. accept the developer terms of service.
#### 2. register an application
1. navigate to the **Dashboard**. 
2. click **Create an App**. 
3. provide a name and description for your app. 
4. agree to spotify's terms and click **Create**.
#### 3. retrieve client id and client secret 
1. open your newly created app in the dashboard. 
2. copy the **Client ID**. 
3. click **Show Client Secret** and copy the **Client Secret**. 
#### 4. Store Credentials in an `.env` File 
1. Create a file named `.env` in your project directory. 
2. Add the following lines, replacing the placeholders with your credentials: 
``` bash
CLIENT_ID=your_client_id_here 
CLIENT_SECRET=your_client_secret_here
```
## installation

```bash
git clone https://github.com/tkofb/spotty.git
```

## usage

```bash
cd spotty

# modify the .env file as listed above

# the code below steps you through downloading
# your spotify playlists

python spotty.py
```

## example step-through
![](./viewr.mp4)


## contributing

pull requests are welcome. for major changes, please open an issue first  
to discuss what you would like to change.  

please make sure to update tests as appropriate.  

## license

[MIT](https://choosealicense.com/licenses/mit/)