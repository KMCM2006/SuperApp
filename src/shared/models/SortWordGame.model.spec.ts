import { SortWordGame } from './sortWordGame.model';
import { Product } from './product.model';

describe("Test SortWordGame model", function() {
    let product: Product;
    let sortWordGame: SortWordGame;
    let response: any = [];
    let colorProviderMock;

    beforeEach(function() {
        product = Product.createProduct(1, 'title1', 'image1', 2);
        sortWordGame = new SortWordGame(product);
        colorProviderMock = jasmine.createSpyObj('ArrayColorProvider',['getRandomColor']);

        for (let letter of sortWordGame.ResponseWord) {
            response[letter] = colorProviderMock.getRandomColor();
        }
    });

    afterEach(function() {
        product = null;
        sortWordGame = null;
    });

    it('must return false because is not game over', function() {
        expect(sortWordGame.isGameOver()).toBe(false);
    });

    it('must return true because is game over', function() {
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();

        expect(sortWordGame.isGameOver()).toBe(true);
    });

    it('must return the product that was used in constructor', function() {
        expect(sortWordGame.Product).toBe(product);
    });

    it('must return the title of product', function() {
        expect(sortWordGame.ResponseWord).toBe(product.Title);
    });

    it('must return messy letters of response word', function() {
        sortWordGame.buildLetters(response, 1);

        expect(sortWordGame.MessyWord).not.toBe(sortWordGame.SortedWord);
    });

    it('must return sorted letters of response word', function() {
        sortWordGame.buildLetters(response, 1);

        for (let i = 0; i < product.Title.length; ++i) {
            expect(product.Title[i]).toBe(sortWordGame.SortedWord[i].letter);
        }
    });

    it('must set a new product', function() {
        let newProduct: Product;
        newProduct = Product.createProduct(10, 'newTitle', 'newImage', 100);

        sortWordGame.Product = newProduct;

        expect(sortWordGame.Product).toBe(newProduct);
    });
});
