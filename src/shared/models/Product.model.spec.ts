import { Product } from './product.model';

describe("Test Product model", function() {
    let emptyProduct: Product;

    beforeEach(function() {
        emptyProduct = new Product();
    });

    afterEach(function() {
        emptyProduct = null;
    });

    it('must return -1 as id', function() {
        expect(emptyProduct.Id).toBe(-1);
    });

    it('must return empty as title', function() {
        expect(emptyProduct.Title).toBe('');
    });

    it('must return empty as image', function() {
        expect(emptyProduct.ImageURL).toBe('');
    });

    it('must return 0 as level', function() {
        expect(emptyProduct.Level).toBe(0);
    });
});
