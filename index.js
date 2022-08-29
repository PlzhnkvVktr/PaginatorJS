import { getPosts, getCommentsById, createPost, removePost } from "./js/api.js";

const postsData = await getPosts();
let currentPage = 1; // текущая страница
let limit = 10; // лимит постов на страницу
let searhInp = document.querySelector('input')
const state = {
    posts: [...postsData],
    newPost : {
        title: '',
        body: '',
    },
    editPost: {}
    }

const main = async () => {
    document.getElementById('inp').oninput = searh
    let paginator = document.getElementsByClassName('pagination__list')
    
    function searh() {
        paginator[0].remove();
        const title = searhInp.value
        state.posts = postsData.filter(e => 
            e.body.toLowerCase().includes(title.toLowerCase())
            +
            e.title.toLowerCase().includes(title.toLowerCase())
        )
        
        displayList(state.posts, limit, currentPage);
        displayPagination(state.posts, limit);
    }

    const displayList = (data, row, page) => {
        const postsEl = document.querySelector('.posts');
        postsEl.innerHTML = "";
        page--;
        const start = row * page;
        const end = start + row;
        const paginatedData = data.slice(start, end);
        const modalPostContainer = document.getElementById('modalPostContainer')
        const commentsPosts = document.createElement('div')
        modalPostContainer.appendChild(commentsPosts)
        const modalCreatePost = document.getElementById('modal__createPost')
        const createPostBtn = document.getElementById('create_post')
        const close = document.getElementsByClassName('close')[0]
        const modalPost = document.getElementById('modal__openPost')

        paginatedData.forEach((el) => {
            const postEl = document.createElement("div");
            postEl.classList.add("post");
            const removePostBtn = document.createElement("button");
            removePostBtn.innerText = 'Delete'
            postEl.innerHTML = `<h3 class="title__post">${el.title}</h3> <p class="body__post">${el.body}</p>`;
            postEl.id = el.id
            postsEl.appendChild(postEl);
            postsEl.appendChild(removePostBtn);

            createPostBtn.onclick = async () => {
                modalCreatePost.style.display = "block";
                const postTitle = document.getElementsByTagName('textarea')[0]
                const postBody = document.getElementsByTagName('textarea')[1]
                const sendBtn = document.getElementById('sendBtn')
                postTitle.addEventListener('change', e => state.newPost.title = e.target.value)
                postBody.addEventListener('change', e => state.newPost.body = e.target.value)
                
                sendBtn.onclick = async () => {
                    modalCreatePost.style.display = "none";
                    const post = await createPost(state.newPost)
                    if (post) {
                      state.posts.push(post)    
                    }
                    displayList(state.posts, limit, currentPage);
                    displayPagination(state.posts, limit);
                    paginator[0].remove();
                }
            }

            close.onclick = () => {
                modalCreatePost.style.display = "none";
            }
            
            postEl.onclick = async () => {
                const editeblePost = state.posts[postEl.id - 1]
                state.editPost = editeblePost;
                postTitle.value = state.editPost.title;
                postBody.value = state.editPost.body;
                document.getElementById('postTitle').innerHTML = state.editPost.title
                document.getElementById('postBody').innerHTML = state.editPost.body

                const response = await getCommentsById(postEl.id)
                
                response.forEach((el) =>{
                    const comment = document.createElement("div"); 
                    comment.classList.add("comments");   
                    commentsPosts.appendChild(comment)
                    comment.innerHTML = `<p>${el.email}</p> <br> <p>${el.body}</p>`
                    }
                )

                modalPost.style.display = "block";
            }

            removePostBtn.onclick = async () => {
              if (await removePost(postEl.id)) {
                postEl.remove()
                removePostBtn.remove()
              }
            }
            modalPost.onclick = () => {
                modalPost.style.display = "none";
                commentsPosts.innerHTML = ""
            }
        })
    }

    const displayPagination = (data, row) => {
        const paginationEl = document.querySelector('.pagination');
        const pagesCount = Math.ceil(data.length / row);
        const ulEl = document.createElement("ul");
        ulEl.classList.add('pagination__list');

        for (let i = 0; i < pagesCount; i++) {
          const liEl = displayPaginationBtn(i + 1);
          ulEl.appendChild(liEl)
        }
        paginationEl.appendChild(ulEl)
    }


    
    const displayPaginationBtn = (page) => {
        const liEl = document.createElement("li");
        liEl.classList.add('pagination__item')
        liEl.innerText = page

        if (currentPage == page) liEl.classList.add('pagination__item--active');

        liEl.addEventListener('click', () => {
        currentPage = page
        displayList(state.posts, limit, currentPage)

        let currentItemLi = document.querySelector('li.pagination__item--active');
        currentItemLi.classList.remove('pagination__item--active');

        liEl.classList.add('pagination__item--active');
        })

        if (!liEl.classList.contains('pagination__item--active')) {
            currentPage = 1
        }

        return liEl;
    }
    
    if (searhInp.value === '') {
        displayList(state.posts, limit, currentPage);
        displayPagination(state.posts, limit);
    }
}

main();