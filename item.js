class items {
  constructor(name, url, image) {
    this.name = name;
    this.url = url;
    this.image = image;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get url() {
    return this._url;
  }

  set url(url) {
    this._url = url;
  }

  get image() {
    return this._image;
  }

  set image(image) {
    this._image = image;
  }

}

const itemsArr = []

export { items, itemsArr };