<?php

namespace Wikia\Persistence\User;

use Swagger\Client\User\Preferences\Api\UserPreferencesApi;
use Swagger\Client\User\Preferences\Models\Preference as SwaggerPreference;
use Wikia\Domain\User\Preference;
use Wikia\Service\Swagger\ApiProvider;

class PreferencePersistenceSwaggerServiceTest extends \PHPUnit_Framework_TestCase {

	protected $userId = 1;

	/** @var PreferencePersistenceSwaggerService */
	protected $persistence;

	/** @var \PHPUnit_Framework_MockObject_MockObject */
	protected $apiProvider;

	/** @var \PHPUnit_Framework_MockObject_MockObject */
	protected $userPreferencesApi;

	public function setUp() {
		$this->apiProvider = $this->getMockBuilder(ApiProvider::class)
			->setMethods(['getAuthenticatedApi'])
			->disableOriginalConstructor()
			->disableAutoload()
			->getMock();
		$this->userPreferencesApi = $this->getMockBuilder(UserPreferencesApi::class)
			->setMethods(['updateUserPreferences', 'getUserPreferences'])
			->disableOriginalConstructor()
			->disableAutoload()
			->getMock();
		$this->apiProvider->expects($this->any())
			->method('getAuthenticatedApi')
			->with(PreferencePersistenceSwaggerService::SERVICE_NAME, $this->userId, UserPreferencesApi::class)
			->willReturn($this->userPreferencesApi);

		$this->persistence = new PreferencePersistenceSwaggerService($this->apiProvider);
	}

	public function testGetSuccess() {
		$this->userPreferencesApi->expects($this->once())
			->method('getUserPreferences')
			->with($this->userId)
			->willReturn([
				(new SwaggerPreference())->setName('pref1')->setValue('val1'),
				(new SwaggerPreference())->setName('pref2')->setValue('val2'),
			]);

		$prefs = $this->persistence->get($this->userId);

		$this->assertEquals(2, count($prefs));
		$this->assertEquals($prefs[0], new Preference('pref1', 'val1'));
		$this->assertEquals($prefs[1], new Preference('pref2', 'val2'));
	}

	public function testGetEmpty() {
		$this->userPreferencesApi->expects($this->once())
			->method('getUserPreferences')
			->with($this->userId)
			->willReturn([]);

		$prefs = $this->persistence->get($this->userId);

		$this->assertTrue(is_array($prefs));
		$this->assertEmpty($prefs);
	}

	public function testSave() {
		$this->userPreferencesApi->expects($this->once())
			->method('updateUserPreferences')
			->with($this->userId, [(new SwaggerPreference())->setName("pref1")->setValue("val1")])
			->willReturn(true);

		$this->assertTrue($this->persistence->save($this->userId, [new Preference("pref1", "val1")]));
	}
}
