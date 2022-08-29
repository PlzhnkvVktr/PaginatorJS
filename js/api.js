const URL_PREFIX = 'https://jsonplaceholder.typicode.com'

export const getPosts = async () => {
    const response = await fetch(`${URL_PREFIX}/posts`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }).catch(e => console.log(e))
    const data = await response.json();
    return data;
  }

export const getCommentsById = async (id) => {
  const response = await fetch(`${URL_PREFIX}/posts/${id}/comments`, {
    method: 'GET',
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  }).catch(e => console.log(e))
  const data = await response.json();
  return data;
}

export const createPost = async (newPost) => {
  const response = await fetch(`${URL_PREFIX}/posts`, {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  }).catch(e => {
    console.log(e)
    return null
  })
  const data = await response.json();
  return data
}

export const removePost = async (id) => {
  const response = await fetch(`${URL_PREFIX}/posts/${id}`, {
    method: 'DELETE',
  }).catch(e => {
    console.log(e)
    return false
  })

  return true
}