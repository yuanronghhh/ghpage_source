Python 分页, 预防页数为0


### Code
```python
# params
page_size = 0
total = 10

# default_page_size
config = {page_size: 10}

page_size = page_size if page_size > 0 else config[page_size]
count = int(total / (page_size + 0.1)) + 1

print count
```
