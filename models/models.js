module.exports = {
    Category: class {
        constructor(categoryId, category, ownerId) {
            switch (arguments.length) {
                case 1:
                    return Object.assign(this, categoryId);
                case 2:
                    this.category = categoryId;
                    this.ownerId = category;
                    break;
                default:
                    this.categoryId = categoryId;
                    this.category = category;
                    this.ownerId = ownerId;
                    break;
            }
        }
    },

    Account: class {
        constructor(a, b, c, d) {
            switch (arguments.length) {
                case 1:
                    return Object.assign(this, a);
                case 2:
                    this.username = a;
                    this.password = b;
                    break;
                case 3:
                    this.email = a;
                    this.username = b;
                    this.password = c;
                    break;
                default:
                    this.accountId = a;
                    this.email = b;
                    this.username = c;
                    this.password = d;
                    break;
            }
        }
    }
}
